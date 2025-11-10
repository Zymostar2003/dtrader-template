import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { Popover } from '@deriv/components';
import {
    StandaloneClockThreeRegularIcon,
    StandaloneFileRegularIcon,
    StandaloneGlobeRegularIcon,
    StandaloneMoonRegularIcon,
    StandaloneSunBrightRegularIcon,
} from '@deriv/quill-icons';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv-com/translations';

import BrandShortLogo from '../../../Containers/Layout/header/brand-short-logo';
import LanguageSettings from '../../../Containers/SettingsModal/settings-language';

type TSidebarItem = {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean;
    badge?: number;
    dataTestId?: string;
};

type TSidebarFlyout = 'theme' | 'language' | null;

const Sidebar = observer(() => {
    const { ui, client, portfolio } = useStore();
    const {
        is_dark_mode_on,
        setDarkMode,
        is_language_settings_modal_on,
        toggleLanguageSettingsModal,
        togglePositionsDrawer,
        is_positions_drawer_on,
    } = ui;
    const { is_logged_in } = client;
    const { active_positions_count } = portfolio;
    const location = useLocation();
    const history = useHistory();

    const [activeFlyout, setActiveFlyout] = React.useState<TSidebarFlyout>(null);

    const isActiveRoute = (path: string) => {
        if (path === routes.index) {
            return location.pathname === routes.index;
        }
        return location.pathname.startsWith(path);
    };

    const handleThemeToggle = () => {
        setDarkMode(!is_dark_mode_on);
    };

    const handleLanguageToggle = () => {
        toggleLanguageSettingsModal();
    };

    const handlePositionsToggle = () => {
        togglePositionsDrawer();
    };

    const handleReportsClick = () => {
        history.push(routes.reports);
    };

    // Main navigation items
    const navigationItems: TSidebarItem[] = [
        {
            id: 'positions',
            icon: <StandaloneClockThreeRegularIcon iconSize='sm' />,
            label: localize('Positions'),
            onClick: handlePositionsToggle,
            isActive: is_positions_drawer_on,
            badge: active_positions_count,
            dataTestId: 'dt_sidebar_positions',
        },
        {
            id: 'reports',
            icon: <StandaloneFileRegularIcon iconSize='sm' />,
            label: localize('Reports'),
            onClick: handleReportsClick,
            isActive: isActiveRoute(routes.reports),
            dataTestId: 'dt_sidebar_reports',
        },
    ];

    // Utility items (bottom section)
    const utilityItems = [
        {
            id: 'theme',
            icon: is_dark_mode_on ? (
                <StandaloneSunBrightRegularIcon iconSize='sm' />
            ) : (
                <StandaloneMoonRegularIcon iconSize='sm' />
            ),
            label: localize('Theme'),
            onClick: handleThemeToggle,
            dataTestId: 'dt_sidebar_theme',
        },
        {
            id: 'language',
            icon: <StandaloneGlobeRegularIcon iconSize='sm' />,
            label: localize('Language'),
            onClick: handleLanguageToggle,
            dataTestId: 'dt_sidebar_language',
        },
    ];

    return (
        <>
            <aside className='sidebar'>
                {/* Logo Section */}
                <div className='sidebar__header'>
                    <BrandShortLogo />
                </div>

                {/* Main Navigation */}
                <nav className='sidebar__nav'>
                    <div className='sidebar__nav-main'>
                        {navigationItems.map(item => (
                            <Popover
                                key={item.id}
                                alignment='right'
                                message={item.label}
                                zIndex='9999'
                                classNameBubble='sidebar__tooltip'
                            >
                                <button
                                    className={classNames('sidebar__item', {
                                        'sidebar__item--active': item.isActive,
                                    })}
                                    onClick={item.onClick}
                                    data-testid={item.dataTestId}
                                    aria-label={item.label}
                                >
                                    <span className='sidebar__item-icon'>{item.icon}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className='sidebar__item-badge'>{item.badge}</span>
                                    )}
                                </button>
                            </Popover>
                        ))}
                    </div>

                    {/* Utility Section */}
                    <div className='sidebar__nav-utility'>
                        {utilityItems.map(item => (
                            <Popover
                                key={item.id}
                                alignment='right'
                                message={item.label}
                                zIndex='9999'
                                classNameBubble='sidebar__tooltip'
                            >
                                <button
                                    className='sidebar__item'
                                    onClick={item.onClick}
                                    data-testid={item.dataTestId}
                                    aria-label={item.label}
                                >
                                    <span className='sidebar__item-icon'>{item.icon}</span>
                                </button>
                            </Popover>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Language Settings Modal */}
            {is_language_settings_modal_on && (
                <LanguageSettings
                    is_visible={is_language_settings_modal_on}
                    toggleModal={toggleLanguageSettingsModal}
                />
            )}
        </>
    );
});

export default Sidebar;
