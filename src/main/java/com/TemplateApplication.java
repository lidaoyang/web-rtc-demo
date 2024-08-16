/**
 * 版本: 1.1.0
 * 更新时间: 2021/10/10 14:30
 * 更新内容: 继承 SpringBootServletInitializer 类, 方便打包war包部署
 */

package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
@ServletComponentScan("com.server")
//继承SpringBootServletInitializer 重写 configure 方便打包成 war包, 部署到外部服务器。
public class TemplateApplication extends SpringBootServletInitializer
{

    public static void main(String[] args)
    {
        final ConfigurableApplicationContext ioc = SpringApplication.run(TemplateApplication.class, args);
    }

    //重写 configure 方便打包成 war包, 部署到外部服务器。
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder)
    {
        return builder.sources(this.getClass());
    }
}
