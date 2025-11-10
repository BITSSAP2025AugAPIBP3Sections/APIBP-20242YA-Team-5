import { query } from '@config/database';

export interface VerificationLog {
  id: string;
  certificateId: string;
  verificationMethod: 'id' | 'code' | 'signature' | 'bulk';
  verifierIp?: string;
  verifierInfo?: string;
  result: 'valid' | 'invalid' | 'error';
  errorMessage?: string;
  timestamp: Date;
  responseTime?: number;
}

export interface VerificationLogCreate {
  certificateId: string;
  verificationMethod: 'id' | 'code' | 'signature' | 'bulk';
  verifierIp?: string;
  verifierInfo?: string;
  result: 'valid' | 'invalid' | 'error';
  errorMessage?: string;
  responseTime?: number;
}

export class VerificationLogModel {
  static async create(data: VerificationLogCreate): Promise<VerificationLog> {
    const text = `
      INSERT INTO verification_logs(
        certificate_id, verification_method, verifier_ip, 
        verifier_info, result, error_message, response_time
      )
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      data.certificateId,
      data.verificationMethod,
      data.verifierIp,
      data.verifierInfo,
      data.result,
      data.errorMessage,
      data.responseTime,
    ];

    const result = await query(text, values);
    return result.rows[0];
  }

  static async findById(id: string): Promise<VerificationLog | null> {
    const text = 'SELECT * FROM verification_logs WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0] || null;
  }

  static async findByCertificateId(
    certificateId: string,
    limit: number = 10
  ): Promise<VerificationLog[]> {
    const text = `
      SELECT * FROM verification_logs 
      WHERE certificate_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `;
    const result = await query(text, [certificateId, limit]);
    return result.rows;
  }

  static async getStatistics(days: number = 30) {
    const text = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as total_verifications,
        COUNT(*) FILTER (WHERE result = 'valid') as valid_count,
        COUNT(*) FILTER (WHERE result = 'invalid') as invalid_count,
        COUNT(*) FILTER (WHERE result = 'error') as error_count,
        AVG(response_time) as avg_response_time
      FROM verification_logs
      WHERE timestamp >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `;
    const result = await query(text);
    return result.rows;
  }

  static async deleteOldLogs(days: number): Promise<number> {
    const text = `
      DELETE FROM verification_logs 
      WHERE timestamp < NOW() - INTERVAL '${days} days'
    `;
    const result = await query(text);
    return result.rowCount || 0;
  }
}
