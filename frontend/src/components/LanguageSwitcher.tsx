import { Button } from '../components/ui/button';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2 min-w-[80px] hover:bg-accent transition-colors"
    >
      <span className="text-lg">{language === 'en' ? '🇺🇸' : '🇸🇦'}</span>
      <span className="text-sm font-medium">
        {language === 'en' ? 'EN' : 'عربي'}
      </span>
    </Button>
  );
}