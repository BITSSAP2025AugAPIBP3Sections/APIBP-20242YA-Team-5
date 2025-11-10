import { Request, Response, NextFunction } from 'express';
import { VerificationService } from '@services/verificationService';
import logger from '@utils/logger';

/**
 * Controller for verification endpoints
 */
export class VerificationController {
  /**
   * POST /api/verify - Verify certificate by ID or code
   */
  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId, verificationCode } = req.body;
      const verifierIp = req.ip;

      let result;

      if (certificateId) {
        result = await VerificationService.verifyById(certificateId, verifierIp);
      } else if (verificationCode) {
        result = await VerificationService.verifyByCode(verificationCode, verifierIp);
      } else {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Either certificateId or verificationCode must be provided',
            timestamp: new Date().toISOString(),
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: result.valid ? 'Certificate verified successfully' : 'Certificate verification failed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/verify/:certificateId - Quick verify by ID
   */
  static async verifyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId } = req.params;
      const verifierIp = req.ip;

      const result = await VerificationService.verifyById(certificateId, verifierIp);

      return res.status(200).json({
        success: true,
        data: result,
        message: result.valid ? 'Certificate verified successfully' : 'Certificate verification failed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/verify/code/:verificationCode - Quick verify by code
   */
  static async verifyByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { verificationCode } = req.params;
      const verifierIp = req.ip;

      const result = await VerificationService.verifyByCode(verificationCode, verifierIp);

      return res.status(200).json({
        success: true,
        data: result,
        message: result.valid ? 'Certificate verified successfully' : 'Certificate verification failed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/verify/bulk - Bulk verification
   */
  static async verifyBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificates } = req.body;
      const verifierIp = req.ip;

      const results = await VerificationService.verifyBulk(certificates, verifierIp);

      const totalRequested = results.length;
      const validCertificates = results.filter((r) => r.valid).length;
      const invalidCertificates = totalRequested - validCertificates;

      return res.status(200).json({
        success: true,
        data: {
          totalRequested,
          validCertificates,
          invalidCertificates,
          results,
        },
        message: `Bulk verification completed. ${validCertificates}/${totalRequested} certificates are valid.`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/verify/signature - Verify digital signature
   */
  static async verifySignature(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateHash, digitalSignature, universityId } = req.body;
      const verifierIp = req.ip;

      const result = await VerificationService.verifySignature(
        certificateHash,
        digitalSignature,
        universityId,
        verifierIp
      );

      return res.status(200).json({
        success: true,
        data: result,
        message: result.valid ? 'Digital signature verified successfully' : 'Digital signature verification failed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/verify/statistics - Get verification statistics (admin)
   */
  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const days = parseInt(req.query.days as string) || 30;

      const statistics = await VerificationService.getStatistics(days);

      return res.status(200).json({
        success: true,
        data: {
          period: `Last ${days} days`,
          statistics,
        },
        message: 'Statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/verify/history/:certificateId - Get verification history
   */
  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const history = await VerificationService.getVerificationHistory(certificateId, limit);

      return res.status(200).json({
        success: true,
        data: {
          certificateId,
          totalRecords: history.length,
          history,
        },
        message: 'Verification history retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
