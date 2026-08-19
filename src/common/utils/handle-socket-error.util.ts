import { WsException } from "@nestjs/websockets"
import { EntityNotFoundError, QueryFailedError } from "typeorm";

type DatabaseError = {
  code?: string;
  detail?: string;
  column?: string;
  message?: string;
};

type InfrastructureError = {
  name?: string;
  code?: string;
  message?: string;
};

export const handleWsError = (error: unknown): never => {
    if (error instanceof WsException) {
        throw error;
    }

    if (error instanceof EntityNotFoundError) {
        throw new WsException({
            code: 'NOT_FOUND',
            message: 'Record not found',
        });
    }

    if (error instanceof QueryFailedError) {
        const dbError = error.driverError as DatabaseError;
        switch (dbError.code) {
            case '23505':
                throw new WsException({
                    code: 'CONFLICT',
                    message: 'Duplicate value violates unique constrant',
                    detail: dbError.detail,
                });
            case '23503':
                throw new WsException({
                    code: 'BAD_REQUEST',
                    message: 'Foreign key constrant violation',
                    detail: dbError.detail,
                });
            case '23502':
                throw new WsException({
                    code: 'BAD_REQUEST',
                    message: 'REquired field is missing',
                    detail: dbError.detail,
                });
            case '22P02':
                throw new WsException({
                    code: 'BAD_REQUEST',
                    message: 'Invalid input syntax',
                    detail: dbError.detail,
                });
            case '57014':
                throw new WsException({
                    code: 'TIMEOUT',
                    message: 'Database query timeout',
                });
            default:
                throw new WsException({
                    code: 'DATABASE_ERROR',
                    message: 'Database error',
                });
        }
    }

    const infrastructureError = error as InfrastructureError;
    
    if (infrastructureError.name === 'TimeoutError') {
        throw new WsException({
            code: 'TIMEOUT',
            message: 'Operation time out',
        });
    }

    if (infrastructureError.code === 'ECONNREFUSED') {
        throw new WsException({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Database connection refused',
        });
    }

    console.error('[UNHANDLED WS ERROR]', error);
    
    throw new WsException({
        code: 'INTERNAL_ERROR',
        message: 'Unexpected server error',
    });


}