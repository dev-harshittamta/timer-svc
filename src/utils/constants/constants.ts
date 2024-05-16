export const enum API_STATUS {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}

export const enum API_MESSAGE {
    SET_TIMER_SUCCESS = 'Timer set successfully.',
    SET_TIMER_ERROR = 'Error while setting timer.',
    DEL_TIMER_SUCCESS = 'Timer deleted successfully.',
    DEL_TIMER_ERROR = 'Error while deleting timer.',
    TIMER_NOT_FOUND = 'Timer not found.',
    VALIDATION_FAILED = 'Validation failed.'
}

export const enum TIMEOUT_MESSAGE {
    EXPIRED = 'expired'
}

export const enum PARSE_TYPE {
    BODY = 'body',
    PARAMS = 'params'
}

export const enum  CHANNEL {
    EXPIRED = '__keyevent@0__:expired'
}

export const enum Topics {
    TIMER = 'Timer.events'
}