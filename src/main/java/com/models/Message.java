package com.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message
{
    private String operation;
    private Object msg;

    public Message setOperation(String operation)
    {
        this.operation = operation;
        return this;
    }

    public Message setMsg(Object msg)
    {
        this.msg = msg;
        return this;
    }

    public String getMsgStr(){
        return msg == null ? "" : msg.toString();
    }
}
