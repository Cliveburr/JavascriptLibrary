import React from 'react';
import { Dropdown, createDropdownItem, createDropdownDivider } from '../../components/ui/dropdown';

const DropdownDebugPage: React.FC = () => {
    // Icons simples para demonstração
    const UserIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 9a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5z" />
        </svg>
    );

    const SettingsIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
    );

    const LogoutIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3.5a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-2a.5.5 0 00-1 0v2A1.5 1.5 0 006.5 14h8a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-8A1.5 1.5 0 005 3.5v2a.5.5 0 001 0v-2z" />
            <path d="M11.854 8.354a.5.5 0 000-.708l-3-3a.5.5 0 10-.708.708L10.293 7.5H1.5a.5.5 0 000 1h8.793l-2.147 2.146a.5.5 0 00.708.708l3-3z" />
        </svg>
    );

    // Menu items para demonstração
    const menuItems = [
        createDropdownItem('profile', 'Profile', {
            icon: <UserIcon />,
            onClick: () => alert('Profile clicked')
        }),
        createDropdownItem('settings', 'Settings', {
            icon: <SettingsIcon />,
            onClick: () => alert('Settings clicked')
        }),
        createDropdownDivider('divider1'),
        createDropdownItem('logout', 'Logout', {
            icon: <LogoutIcon />,
            onClick: () => alert('Logout clicked')
        })
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary p-xl">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-xl text-center">Dropdown Component Test</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">

                    {/* Tamanhos */}
                    <div className="bg-bg-secondary p-lg rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-lg">Sizes</h2>
                        <div className="space-y-md">
                            <Dropdown
                                size="sm"
                                placeholder="Small"
                                items={menuItems}
                            />
                            <Dropdown
                                size="md"
                                placeholder="Medium"
                                items={menuItems}
                            />
                            <Dropdown
                                size="lg"
                                placeholder="Large"
                                items={menuItems}
                            />
                        </div>
                    </div>

                    {/* Cores */}
                    <div className="bg-bg-secondary p-lg rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-lg">Colors</h2>
                        <div className="space-y-md">
                            <Dropdown
                                variant="default"
                                placeholder="Default"
                                items={menuItems}
                            />
                            <Dropdown
                                variant="primary"
                                placeholder="Primary"
                                items={menuItems}
                            />
                            <Dropdown
                                variant="secondary"
                                placeholder="Secondary"
                                items={menuItems}
                            />
                            <Dropdown
                                variant="accent"
                                placeholder="Accent"
                                items={menuItems}
                            />
                            <Dropdown
                                variant="outline"
                                placeholder="Outline"
                                items={menuItems}
                            />
                        </div>
                    </div>

                    {/* Border Radius */}
                    <div className="bg-bg-secondary p-lg rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-lg">Border Radius</h2>
                        <div className="space-y-md">
                            <Dropdown
                                borderRadius="sm"
                                placeholder="Small Radius"
                                items={menuItems}
                            />
                            <Dropdown
                                borderRadius="md"
                                placeholder="Medium Radius"
                                items={menuItems}
                            />
                            <Dropdown
                                borderRadius="lg"
                                placeholder="Large Radius"
                                items={menuItems}
                            />
                            <Dropdown
                                borderRadius="xl"
                                placeholder="XL Radius"
                                items={menuItems}
                            />
                        </div>
                    </div>

                    {/* Full Width */}
                    <div className="bg-bg-secondary p-lg rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-lg">Full Width</h2>
                        <Dropdown
                            fullWidth
                            placeholder="Full Width Dropdown"
                            items={menuItems}
                        />
                    </div>

                    {/* Custom Content */}
                    <div className="bg-bg-secondary p-lg rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-lg">Custom Content</h2>
                        <Dropdown placeholder="Custom Content">
                            <div className="p-md">
                                <h4 className="text-sm font-bold mb-sm">Quick Actions</h4>
                                <button className="w-full text-left p-sm hover:bg-bg-tertiary rounded mb-xs">
                                    Create new file
                                </button>
                                <button className="w-full text-left p-sm hover:bg-bg-tertiary rounded mb-xs">
                                    Open folder
                                </button>
                                <div className="border-t border-border my-sm"></div>
                                <input
                                    type="text"
                                    className="w-full bg-bg-primary border border-border rounded px-sm py-xs text-sm"
                                    placeholder="Search..."
                                />
                            </div>
                        </Dropdown>
                    </div>

                    {/* Disabled */}
                    <div className="bg-bg-secondary p-lg rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-lg">Disabled</h2>
                        <Dropdown
                            disabled
                            placeholder="Disabled Dropdown"
                            items={menuItems}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DropdownDebugPage;
