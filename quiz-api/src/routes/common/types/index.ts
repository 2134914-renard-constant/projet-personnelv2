import { Response, Request } from 'express';


/******************************************************************************
                                Types
******************************************************************************/

type TRecord = Record<string, unknown>;

export type IReq<Body = TRecord, Params = TRecord> = Request<Params, void, Body, TRecord>;
export type IRes = Response<unknown, TRecord>;

