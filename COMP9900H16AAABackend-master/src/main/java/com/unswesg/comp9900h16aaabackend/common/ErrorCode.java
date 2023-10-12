package com.unswesg.comp9900h16aaabackend.common;

public enum   ErrorCode {

    SUCCESS(0, "ok"),
    PARAMS_ERROR(40000, "params error"),
    NOT_LOGIN_ERROR(40100, "not login"),
    NO_AUTH_ERROR(40101, "no auth"),
    NOT_FOUND_ERROR(40400, "not found"),
    FORBIDDEN_ERROR(40300, "forbidden"),
    SYSTEM_ERROR(50000, "system error"),
    OPERATION_ERROR(50001, "operation error");

    /**
     * 状态码
     */
    private final int code;

    /**
     * 信息
     */
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}