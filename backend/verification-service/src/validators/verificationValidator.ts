import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Schema for verify by ID or code (POST /api/verify)
export const verifySchema = Joi.object({
  certificateId: Joi.string().uuid().optional(),
  verificationCode: Joi.string().pattern(/^[A-Z0-9]{6,8}$/).optional(),
}).xor('certificateId', 'verificationCode'); // Exactly one must be present

// Schema for bulk verification
export const bulkVerifySchema = Joi.object({
  certificates: Joi.array()
    .items(
      Joi.object({
        certificateId: Joi.string().uuid().optional(),
        verificationCode: Joi.string().pattern(/^[A-Z0-9]{6,8}$/).optional(),
      }).xor('certificateId', 'verificationCode')
    )
    .min(1)
    .max(100)
    .required(),
});

// Schema for signature verification
export const signatureVerifySchema = Joi.object({
  certificateHash: Joi.string().length(64).hex().required(),
  digitalSignature: Joi.string().base64().required(),
  universityId: Joi.string().uuid().required(),
});

// UUID parameter validation
export const uuidParamSchema = Joi.object({
  certificateId: Joi.string().uuid().required(),
});

// Verification code parameter validation
export const codeParamSchema = Joi.object({
  verificationCode: Joi.string().pattern(/^[A-Z0-9]{6,8}$/).required(),
});

/**
 * Validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Replace validated data
    if (source === 'body') {
      req.body = value;
    } else if (source === 'params') {
      req.params = value;
    } else {
      req.query = value;
    }

    next();
  };
};
