package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.models.Message;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@Log4j2
@Controller
public class WebrtcController {
    /**
     * WebRTC + WebSocket
     */
    @RequestMapping("webrtc/{username}.html")
    public ModelAndView socketChartPage(@PathVariable String username) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("webrtc.html");
        modelAndView.addObject("username", username);
        return modelAndView;
    }
}
