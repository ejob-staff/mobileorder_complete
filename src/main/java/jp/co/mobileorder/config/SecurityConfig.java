package jp.co.mobileorder.config;

import jp.co.mobileorder.service.AppUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, DaoAuthenticationProvider authenticationProvider) throws Exception {
        http
                .authenticationProvider(authenticationProvider)
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/login").permitAll()
                        /*追加実装8: 元々anyRequest().permitAll()に頼っていたsignup/password-resetを明示的に許可*/
                        .requestMatchers(HttpMethod.POST, "/api/signup").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/password-reset").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/status").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products").hasAuthority("ROLE_USER")
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/orders/**").hasAuthority("ROLE_USER")
                        .requestMatchers("/api/reviews/**").hasAuthority("ROLE_USER")
                        /*Spring Securityの基本設定 練習問題3-1-13-1*/
                        .requestMatchers("/api/account").hasAuthority("ROLE_USER")
                        /*修正5: anyRequest().permitAll()をanyRequest().authenticated()に変更し、ルール登録漏れのエンドポイントが誰でもアクセス可能にならないようにした*/
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login
                        .loginProcessingUrl("/api/login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"authenticated\":true}");
                        })
                        .failureHandler((request, response, exception) -> {
                            {/*修正6: failureHandlerの中身を書き換え、未認証のパスワード確認オラクルだった/api/auth/login-checkを廃止してここでDisabledExceptionからアカウント無効を判定するようにした*/}
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            var reason = exception instanceof DisabledException ? "disabled" : "invalid";
                            response.getWriter().write("{\"authenticated\":false,\"reason\":\"" + reason + "\"}");
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpStatus.NO_CONTENT.value()))
                        .permitAll()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                );

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider(AppUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        var provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}
