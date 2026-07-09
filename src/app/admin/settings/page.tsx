import { SettingsContainer } from '@/containers/settings/SettingsContainer';
import { PortalThemeSettings } from '@/containers/settings/PortalThemeSettings';

export default function AdminSettingsPage() {
  return <SettingsContainer extraSections={<PortalThemeSettings />} />;
}
