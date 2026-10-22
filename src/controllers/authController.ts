import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Both email and password are required',
        });
      }

      // If live Supabase auth is available
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return res.status(401).json({
            status: 'error',
            message: error.message,
          });
        }

        const profile = await EnergyStore.getProfile();
        return res.status(200).json({
          status: 'success',
          message: 'Operator authenticated successfully',
          data: {
            session: data.session,
            user: data.user,
            profile,
          },
        });
      }

      // Fallback / Demo session
      const profile = await EnergyStore.getProfile();
      return res.status(200).json({
        status: 'success',
        message: 'Operator session established (Demo Node Mode)',
        data: {
          token: 'demo-jwt-wattwise-telemetry-token',
          user: {
            id: profile.id,
            email: profile.email,
            nodeId: profile.nodeId,
          },
          profile,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Authentication failed',
      });
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required',
        });
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || 'New Operator',
            },
          },
        });

        if (error) {
          return res.status(400).json({
            status: 'error',
            message: error.message,
          });
        }

        return res.status(201).json({
          status: 'success',
          message: 'Operator node registered successfully',
          data: data,
        });
      }

      return res.status(201).json({
        status: 'success',
        message: 'Operator registered (Demo Node Mode)',
        data: {
          email,
          fullName: fullName || 'Operator',
          nodeId: `NODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Registration failed',
      });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const profile = await EnergyStore.getProfile();
      const household = await EnergyStore.getHousehold();
      return res.status(200).json({
        status: 'success',
        data: {
          profile,
          activeHousehold: household,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch current operator',
      });
    }
  }
}
