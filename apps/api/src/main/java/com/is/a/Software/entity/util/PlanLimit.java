package com.is.a.Software.entity.util;

import com.is.a.Software.entity.Enum.Plan;

public class PlanLimit {

    public static int getDomainLimit(Plan plan) {
        return switch (plan) {
            case FREE -> 2;
            case PREMIUM -> 10;
            case PREMIUM_PLUS -> 50;
        };
    }

    public static int getDnsLimit(Plan plan) {
        return switch (plan) {
            case FREE -> 5;
            case PREMIUM -> 50;
            case PREMIUM_PLUS -> 200;
        };
    }
}