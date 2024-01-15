package com.ssudam.config;

import com.ssudam.auth.filter.JwtAuthenticationFilter;
import com.ssudam.auth.filter.JwtVerificationFilter;
import com.ssudam.auth.handler.MemberAccessDeniedHandler;
import com.ssudam.auth.handler.MemberAuthenticationEntryPoint;
import com.ssudam.auth.handler.MemberAuthenticationFailureHandler;
import com.ssudam.auth.handler.MemberAuthenticationSuccessHandler;
import com.ssudam.auth.jwt.JwtTokenizer;
import com.ssudam.auth.utils.CustomAuthorityUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfiguration {
    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtils authorityUtils;

    public SecurityConfiguration(JwtTokenizer jwtTokenizer,
                                 CustomAuthorityUtils authorityUtils) {
        this.jwtTokenizer = jwtTokenizer;
        this.authorityUtils = authorityUtils;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .headers().frameOptions().sameOrigin()
                .and()
                .csrf().disable()
                .cors(withDefaults())
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .exceptionHandling()
                .authenticationEntryPoint(new MemberAuthenticationEntryPoint())
                .accessDeniedHandler(new MemberAccessDeniedHandler())
                .and()
                .apply(new CustomFilterConfigurer())
                .and()
                .authorizeHttpRequests(authorize -> authorize
                        .antMatchers(HttpMethod.POST, "/*/members").permitAll()
                        .antMatchers(HttpMethod.PATCH, "/*/members/**").hasRole("USER")
                        .antMatchers(HttpMethod.GET, "/*/members").hasRole("ADMIN")
                        .antMatchers(HttpMethod.GET, "/*/members/**").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.DELETE, "/*/members/**").hasRole("USER")
                        .antMatchers(HttpMethod.POST, "/*/parties").hasRole("USER")
                        .antMatchers(HttpMethod.PATCH, "/*/parties/**").hasRole("USER")
                        .antMatchers(HttpMethod.GET, "/*/parties/**").permitAll()
                        .antMatchers(HttpMethod.DELETE, "/*/parties/**").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.POST, "/*/comments").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.PATCH, "/*/comments/**").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.GET, "/*/comments").permitAll()
                        .antMatchers(HttpMethod.DELETE, "/*/comments/**").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.POST, "/*/likes/comments/**").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.GET, "/*/likes/comments/*/like-status").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.POST, "/*/bookmarks/parties/**").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.GET, "/*/bookmarks/parties/*/bookmark-status").hasAnyRole("USER", "ADMIN")
                        .antMatchers(HttpMethod.POST, "/*/todos").hasRole("ADMIN")
                        .antMatchers(HttpMethod.PATCH, "/*/todos/**").hasRole("ADMIN")
                        .antMatchers(HttpMethod.GET, "/*/todos").permitAll()
                        .antMatchers(HttpMethod.DELETE, "/*/todos/**").hasRole("ADMIN")
                        .antMatchers(HttpMethod.POST, "/*/reviews").hasRole("USER")
                        .antMatchers(HttpMethod.PATCH, "/*/reviews/**").hasRole("USER")
                        .antMatchers(HttpMethod.GET, "/*/reviews").permitAll()
                        .antMatchers(HttpMethod.GET, "/*/reviews/**").permitAll()
                        .antMatchers(HttpMethod.DELETE, "/*/reviews/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "DELETE"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    public class CustomFilterConfigurer extends AbstractHttpConfigurer<CustomFilterConfigurer, HttpSecurity> {
        @Override
        public void configure(HttpSecurity builder) throws Exception {
            AuthenticationManager authenticationManager = builder.getSharedObject(AuthenticationManager.class);

            JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager, jwtTokenizer);
            jwtAuthenticationFilter.setFilterProcessesUrl("/v1/auth/login");
            jwtAuthenticationFilter.setAuthenticationSuccessHandler(new MemberAuthenticationSuccessHandler());
            jwtAuthenticationFilter.setAuthenticationFailureHandler(new MemberAuthenticationFailureHandler());

            JwtVerificationFilter jwtVerificationFilter = new JwtVerificationFilter(jwtTokenizer, authorityUtils);

            builder
                    .addFilter(jwtAuthenticationFilter)
                    .addFilterAfter(jwtVerificationFilter, JwtAuthenticationFilter.class);
        }
    }
}
