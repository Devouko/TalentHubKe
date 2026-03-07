import { BaseService } from './base.service'
import { prisma } from '@/lib/prisma'

export interface SystemTheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
  isActive: boolean
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background?: string
  foreground?: string
  muted?: string
  border?: string
}

export class ThemeService extends BaseService {
  private static readonly DEFAULT_THEMES: Omit<SystemTheme, 'id' | 'isActive'>[] = [
    {
      name: 'Default',
      primary: '262 83% 58%',
      secondary: '123 100% 50%',
      accent: '84 100% 50%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      muted: '240 4.8% 95.9%',
      border: '240 5.9% 90%'
    },
    {
      name: 'Dark Blue',
      primary: '217 91% 60%',
      secondary: '142 76% 36%',
      accent: '47 96% 53%',
      background: '222 84% 5%',
      foreground: '210 40% 98%',
      muted: '217 33% 17%',
      border: '217 33% 17%'
    },
    {
      name: 'Forest Green',
      primary: '142 76% 36%',
      secondary: '47 96% 53%',
      accent: '217 91% 60%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      muted: '240 4.8% 95.9%',
      border: '240 5.9% 90%'
    },
    {
      name: 'Purple',
      primary: '262 83% 58%',
      secondary: '270 95% 75%',
      accent: '280 100% 70%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      muted: '240 4.8% 95.9%',
      border: '240 5.9% 90%'
    }
  ]

  static async getActiveTheme(): Promise<SystemTheme | null> {
    return prisma.system_themes.findFirst({
      where: { isActive: true }
    })
  }

  static async getAllThemes(): Promise<SystemTheme[]> {
    return prisma.system_themes.findMany({
      orderBy: { name: 'asc' }
    })
  }

  static async setActiveTheme(themeId: string): Promise<void> {
    await this.executeWithTracking('setActiveTheme', async () => {
      await prisma.$transaction([
        prisma.system_themes.updateMany({
          data: { isActive: false }
        }),
        prisma.system_themes.update({
          where: { id: themeId },
          data: { isActive: true }
        })
      ])
    }, { themeId })
  }

  static async createCustomTheme(name: string, colors: ThemeColors): Promise<SystemTheme> {
    return this.executeWithTracking('createCustomTheme', async () => {
      return prisma.system_themes.create({
        data: {
          id: this.ID_GENERATORS.user(),
          name,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          background: colors.background || '0 0% 100%',
          foreground: colors.foreground || '240 10% 3.9%',
          muted: colors.muted || '240 4.8% 95.9%',
          border: colors.border || '240 5.9% 90%',
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }, { name })
  }

  static async updateTheme(themeId: string, colors: Partial<ThemeColors>): Promise<SystemTheme> {
    return this.executeWithTracking('updateTheme', async () => {
      return prisma.system_themes.update({
        where: { id: themeId },
        data: colors
      })
    }, { themeId })
  }

  static async initializeDefaultThemes(): Promise<void> {
    const existingThemes = await prisma.system_themes.count()
    
    if (existingThemes === 0) {
      const now = new Date()
      await prisma.system_themes.createMany({
        data: this.DEFAULT_THEMES.map((theme, index) => ({
          ...theme,
          id: this.ID_GENERATORS.user(),
          isActive: index === 0,
          createdAt: now,
          updatedAt: now
        }))
      })
    }
  }

  static generateCSSVariables(theme: SystemTheme): string {
    return `
      :root {
        --primary: ${theme.primary};
        --secondary: ${theme.secondary};
        --accent: ${theme.accent};
        --background: ${theme.background};
        --foreground: ${theme.foreground};
        --muted: ${theme.muted};
        --border: ${theme.border};
        --card: ${theme.background};
        --card-foreground: ${theme.foreground};
        --popover: ${theme.background};
        --popover-foreground: ${theme.foreground};
        --primary-foreground: ${theme.background};
        --secondary-foreground: ${theme.foreground};
        --accent-foreground: ${theme.foreground};
        --muted-foreground: ${theme.foreground};
        --input: ${theme.border};
        --ring: ${theme.primary};
      }
    `
  }
}