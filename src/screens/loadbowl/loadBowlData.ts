export interface Root {
    code: number
    message: string
    result: Result
}

export interface Result {
    GetLoadBowlDetails: GetLoadBowlDetail[]
}

export interface GetLoadBowlDetail {
    SCHEDULED_DATE: string
    SESSION_NO: string
    IS_FEEDER: number
    SLOT_ID: string
    CAGE: string
    LOCATION_ID: string
    FORMULA_DESC: string
    CONTAINER_ID: string
    FEED_ID: string
}


export interface GetSessionDetail {
    SCHEDULED_DATE: string
    SESSION_NO: string
    IS_FEEDER: number
    SLOT_ID: string
    CAGE: string
    LOCATION_ID: string
    FORMULA_DESC: string
    CONTAINER_ID: string
    FEED_ID: string
}

