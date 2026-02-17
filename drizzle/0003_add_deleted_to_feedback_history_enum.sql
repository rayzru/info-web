-- Add 'deleted' value to feedback_history_action_enum
ALTER TYPE "feedback_history_action_enum" ADD VALUE IF NOT EXISTS 'deleted';
