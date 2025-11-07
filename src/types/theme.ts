export interface ThemeCustomization {
  id: string;
  project_id: string;
  organization_id: string;
  primary_color: string;           // Cor primária (#3b82f6)
  secondary_color: string;         // Cor secundária (#8b5cf6)
  background_color: string;        // Fundo (#09090b)
  card_background_color: string;   // Fundo do card (#18181b)
  text_color: string;              // Texto principal (#fafafa)
  text_secondary_color: string;    // Texto secundário (#a1a1aa)
  accent_color: string;            // Cor de destaque (#ec4899)
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  textSecondaryColor: string;
  accentColor: string;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  backgroundColor: '#09090b',
  cardBackgroundColor: '#18181b',
  textColor: '#fafafa',
  textSecondaryColor: '#a1a1aa',
  accentColor: '#ec4899',
};
