import React, { useState } from 'react';
import { Button } from '../ui/buttons/Button';
import { Card } from '../ui/card/Card';
import { Tabs, type TabItem } from '../ui/navigation/Tabs';
import { Dropdown, createDropdownItem, createDropdownDivider } from '../ui/dropdown';
import { CodeExample } from './CodeExample';

interface StyleSection {
    title: string;
    component: React.ReactNode;
}

export const StyleDebug: React.FC = () => {
    const [activeTab, setActiveTab] = useState('buttons');

    const sections: Record<string, StyleSection[]> = {
        buttons: [
            {
                title: 'Button Variants',
                component: (
                    <div className="flex flex-wrap gap-md">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="accent">Accent</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                    </div>
                )
            },
            {
                title: 'Button Sizes',
                component: (
                    <div className="flex flex-wrap items-center gap-md">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                )
            },
            {
                title: 'Button States',
                component: (
                    <div className="flex flex-wrap gap-md">
                        <Button>Normal</Button>
                        <Button disabled>Disabled</Button>
                        <Button isLoading>Loading</Button>
                    </div>
                )
            },
            {
                title: 'Button with Icons',
                component: (
                    <div className="flex flex-wrap gap-md">
                        <Button leftIcon={<span>🏠</span>}>With Left Icon</Button>
                        <Button rightIcon={<span>→</span>}>With Right Icon</Button>
                        <Button leftIcon={<span>✓</span>} rightIcon={<span>→</span>}>Both Icons</Button>
                    </div>
                )
            },
            {
                title: 'All Combinations',
                component: (
                    <div className="grid gap-lg">
                        {['primary', 'secondary', 'accent', 'outline', 'ghost'].map(variant => (
                            <div key={variant} className="grid gap-sm">
                                <h4 className="text-lg font-semibold capitalize">{variant}</h4>
                                <div className="flex flex-wrap gap-sm">
                                    {['sm', 'md', 'lg'].map(size => (
                                        <Button
                                            key={size}
                                            variant={variant as any}
                                            size={size as any}
                                        >
                                            {variant} {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        ],
        cards: [
            {
                title: 'Card Variants',
                component: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <Card variant="default">
                            <h3>Default Card</h3>
                            <p>This is a default card with basic styling.</p>
                        </Card>
                        <Card variant="elevated">
                            <h3>Elevated Card</h3>
                            <p>This card has elevation with shadow effects.</p>
                        </Card>
                        <Card variant="outlined">
                            <h3>Outlined Card</h3>
                            <p>This card has a border outline style.</p>
                        </Card>
                        <Card variant="glass">
                            <h3>Glass Card</h3>
                            <p>This card has a glass morphism effect.</p>
                        </Card>
                    </div>
                )
            },
            {
                title: 'Card Padding',
                component: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <Card variant="outlined" padding="none">
                            <div className="p-sm bg-gray-100">
                                <h4>No Padding</h4>
                                <p>Card with no internal padding.</p>
                            </div>
                        </Card>
                        <Card variant="outlined" padding="sm">
                            <h4>Small Padding</h4>
                            <p>Card with small padding.</p>
                        </Card>
                        <Card variant="outlined" padding="md">
                            <h4>Medium Padding</h4>
                            <p>Card with medium padding (default).</p>
                        </Card>
                        <Card variant="outlined" padding="lg">
                            <h4>Large Padding</h4>
                            <p>Card with large padding.</p>
                        </Card>
                    </div>
                )
            },
            {
                title: 'Card with Glow',
                component: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <Card variant="default" glow>
                            <h3>Glowing Card</h3>
                            <p>This card has a glow effect.</p>
                        </Card>
                        <Card variant="elevated" glow>
                            <h3>Elevated + Glow</h3>
                            <p>Combining elevation with glow effect.</p>
                        </Card>
                    </div>
                )
            }
        ],
        utilities: [
            {
                title: 'Spacing Utilities',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Margins</h4>
                            <div className="flex gap-sm">
                                <div className="bg-blue-100 p-sm">
                                    <div className="bg-blue-500 text-white p-xs m-xs">m-xs</div>
                                </div>
                                <div className="bg-blue-100 p-sm">
                                    <div className="bg-blue-500 text-white p-xs m-sm">m-sm</div>
                                </div>
                                <div className="bg-blue-100 p-sm">
                                    <div className="bg-blue-500 text-white p-xs m-md">m-md</div>
                                </div>
                                <div className="bg-blue-100 p-lg">
                                    <div className="bg-blue-500 text-white p-xs m-lg">m-lg</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Paddings</h4>
                            <div className="flex gap-sm">
                                <div className="bg-green-500 text-white p-xs">p-xs</div>
                                <div className="bg-green-500 text-white p-sm">p-sm</div>
                                <div className="bg-green-500 text-white p-md">p-md</div>
                                <div className="bg-green-500 text-white p-lg">p-lg</div>
                                <div className="bg-green-500 text-white p-xl">p-xl</div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Flexbox Utilities',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Flex Direction</h4>
                            <div className="border p-sm">
                                <div className="flex gap-sm mb-sm">
                                    <div className="bg-red-500 text-white p-sm">1</div>
                                    <div className="bg-red-500 text-white p-sm">2</div>
                                    <div className="bg-red-500 text-white p-sm">3</div>
                                </div>
                                <code>.flex</code>
                            </div>
                            <div className="border p-sm">
                                <div className="flex flex-col gap-sm w-1/3 mb-sm">
                                    <div className="bg-blue-500 text-white p-sm">1</div>
                                    <div className="bg-blue-500 text-white p-sm">2</div>
                                    <div className="bg-blue-500 text-white p-sm">3</div>
                                </div>
                                <code>.flex.flex-col</code>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Justify Content</h4>
                            <div className="space-y-sm">
                                <div className="border p-sm">
                                    <div className="flex justify-start gap-sm">
                                        <div className="bg-purple-500 text-white p-sm">A</div>
                                        <div className="bg-purple-500 text-white p-sm">B</div>
                                    </div>
                                    <code>.justify-start</code>
                                </div>
                                <div className="border p-sm">
                                    <div className="flex justify-center gap-sm">
                                        <div className="bg-purple-500 text-white p-sm">A</div>
                                        <div className="bg-purple-500 text-white p-sm">B</div>
                                    </div>
                                    <code>.justify-center</code>
                                </div>
                                <div className="border p-sm">
                                    <div className="flex justify-between gap-sm">
                                        <div className="bg-purple-500 text-white p-sm">A</div>
                                        <div className="bg-purple-500 text-white p-sm">B</div>
                                    </div>
                                    <code>.justify-between</code>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Typography Utilities',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Font Sizes</h4>
                            <div className="space-y-sm">
                                <div className="text-xs">Extra Small Text (.text-xs)</div>
                                <div className="text-sm">Small Text (.text-sm)</div>
                                <div className="text-base">Base Text (.text-base)</div>
                                <div className="text-lg">Large Text (.text-lg)</div>
                                <div className="text-xl">Extra Large Text (.text-xl)</div>
                                <div className="text-2xl">2X Large Text (.text-2xl)</div>
                                <div className="text-3xl">3X Large Text (.text-3xl)</div>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Font Weights</h4>
                            <div className="space-y-sm">
                                <div className="font-light">Light Weight (.font-light)</div>
                                <div className="font-normal">Normal Weight (.font-normal)</div>
                                <div className="font-medium">Medium Weight (.font-medium)</div>
                                <div className="font-semibold">Semibold Weight (.font-semibold)</div>
                                <div className="font-bold">Bold Weight (.font-bold)</div>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Text Alignment</h4>
                            <div className="space-y-sm border p-sm">
                                <div className="text-left">Left aligned text (.text-left)</div>
                                <div className="text-center">Center aligned text (.text-center)</div>
                                <div className="text-right">Right aligned text (.text-right)</div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Color Utilities',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Text Colors</h4>
                            <div className="space-y-sm">
                                <div className="text-primary">Primary Text (.text-primary)</div>
                                <div className="text-secondary">Secondary Text (.text-secondary)</div>
                                <div className="text-tertiary">Tertiary Text (.text-tertiary)</div>
                                <div className="text-accent">Accent Text (.text-accent)</div>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Background Colors</h4>
                            <div className="space-y-sm">
                                <div className="bg-surface p-sm text-primary">Surface Background (.bg-surface)</div>
                                <div className="bg-surface-2 p-sm text-primary">Surface 2 Background (.bg-surface-2)</div>
                                <div className="bg-surface-3 p-sm text-primary">Surface 3 Background (.bg-surface-3)</div>
                                <div className="bg-dark p-sm text-white">Dark Background (.bg-dark)</div>
                            </div>
                        </div>
                    </div>
                )
            }
        ],
        layout: [
            {
                title: 'Display Utilities',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Block Elements</h4>
                            <div className="space-y-sm">
                                <div className="block bg-blue-100 p-sm">Block element (.block)</div>
                                <div className="inline-block bg-green-100 p-sm">Inline-block element (.inline-block)</div>
                                <div className="inline bg-yellow-100 p-sm">Inline element (.inline)</div>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Visibility</h4>
                            <div className="space-y-sm">
                                <div className="visible bg-red-100 p-sm">Visible element (.visible)</div>
                                <div className="invisible bg-red-100 p-sm">Invisible element (.invisible)</div>
                                <div className="hidden bg-red-100 p-sm">Hidden element (.hidden) - won't show</div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Position & Layout',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Position Types</h4>
                            <div className="relative bg-gray-100 p-lg h-32">
                                <div className="static bg-blue-500 text-white p-sm inline-block">Static (.static)</div>
                                <div className="relative bg-green-500 text-white p-sm inline-block ml-sm">Relative (.relative)</div>
                                <div className="absolute top-0 right-0 bg-red-500 text-white p-sm">Absolute (.absolute)</div>
                            </div>
                            <code>Container with .relative, children with various positions</code>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Width & Height</h4>
                            <div className="space-y-sm">
                                <div className="w-full bg-blue-100 p-sm">Full Width (.w-full)</div>
                                <div className="w-1/2 bg-green-100 p-sm">Half Width (.w-1/2)</div>
                                <div className="w-1/3 bg-yellow-100 p-sm">One Third Width (.w-1/3)</div>
                                <div className="w-1/4 bg-red-100 p-sm">Quarter Width (.w-1/4)</div>
                            </div>
                        </div>
                    </div>
                )
            }
        ],
        forms: [
            {
                title: 'Form Elements (Basic HTML)',
                component: (
                    <div className="space-y-md max-w-md">
                        <div className="grid gap-sm">
                            <label className="font-medium">Input Field</label>
                            <input
                                type="text"
                                placeholder="Enter text here..."
                                className="input"
                            />
                        </div>
                        <div className="grid gap-sm">
                            <label className="font-medium">Textarea</label>
                            <textarea
                                placeholder="Enter multiline text..."
                                className="textarea"
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-sm">
                            <label className="font-medium">Select</label>
                            <select className="select">
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-sm">
                            <input type="checkbox" id="check1" className="checkbox" />
                            <label htmlFor="check1">Checkbox option</label>
                        </div>
                        <div className="flex items-center gap-sm">
                            <input type="radio" id="radio1" name="radio" className="radio" />
                            <label htmlFor="radio1">Radio option 1</label>
                        </div>
                        <div className="flex items-center gap-sm">
                            <input type="radio" id="radio2" name="radio" className="radio" />
                            <label htmlFor="radio2">Radio option 2</label>
                        </div>
                    </div>
                )
            }
        ],
        effects: [
            {
                title: 'Border & Radius',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-sm">
                            <h4>Border Radius</h4>
                            <div className="flex flex-wrap gap-md">
                                <div className="border rounded-sm bg-blue-100 p-md">Small (.rounded-sm)</div>
                                <div className="border rounded-md bg-green-100 p-md">Medium (.rounded-md)</div>
                                <div className="border rounded-lg bg-yellow-100 p-md">Large (.rounded-lg)</div>
                                <div className="border rounded-xl bg-red-100 p-md">Extra Large (.rounded-xl)</div>
                                <div className="border rounded-full bg-purple-100 p-md">Full (.rounded-full)</div>
                            </div>
                        </div>
                        <div className="grid gap-sm">
                            <h4>Borders</h4>
                            <div className="flex flex-wrap gap-md">
                                <div className="border bg-gray-50 p-md">Default Border (.border)</div>
                                <div className="border-0 bg-gray-50 p-md shadow">No Border (.border-0)</div>
                                <div className="border border-primary bg-gray-50 p-md">Primary Border (.border-primary)</div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Shadows & Effects',
                component: (
                    <div className="space-y-md">
                        <div className="grid gap-lg">
                            <h4>Box Shadows (if available)</h4>
                            <div className="flex flex-wrap gap-lg">
                                <div className="bg-white p-lg shadow-sm">Small Shadow</div>
                                <div className="bg-white p-lg shadow">Default Shadow</div>
                                <div className="bg-white p-lg shadow-lg">Large Shadow</div>
                            </div>
                        </div>
                    </div>
                )
            }
        ],
        tabs: [
            {
                title: 'Tab Variants',
                component: (
                    <div className="space-y-lg">
                        <div className="grid gap-md">
                            <h4>Default Tabs</h4>
                            <Tabs
                                items={[
                                    { id: 'tab1', label: 'Tab 1' },
                                    { id: 'tab2', label: 'Tab 2' },
                                    { id: 'tab3', label: 'Tab 3' }
                                ]}
                                activeTab="tab1"
                                onTabChange={() => { }}
                                variant="default"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Pills Tabs</h4>
                            <Tabs
                                items={[
                                    { id: 'pill1', label: 'Overview' },
                                    { id: 'pill2', label: 'Details' },
                                    { id: 'pill3', label: 'Settings' }
                                ]}
                                activeTab="pill2"
                                onTabChange={() => { }}
                                variant="pills"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Underline Tabs</h4>
                            <Tabs
                                items={[
                                    { id: 'under1', label: 'Home' },
                                    { id: 'under2', label: 'About' },
                                    { id: 'under3', label: 'Contact' }
                                ]}
                                activeTab="under3"
                                onTabChange={() => { }}
                                variant="underline"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Bordered Tabs</h4>
                            <Tabs
                                items={[
                                    { id: 'border1', label: 'Dashboard' },
                                    { id: 'border2', label: 'Analytics' },
                                    { id: 'border3', label: 'Reports' }
                                ]}
                                activeTab="border1"
                                onTabChange={() => { }}
                                variant="bordered"
                            />
                        </div>
                    </div>
                )
            },
            {
                title: 'Tab Sizes',
                component: (
                    <div className="space-y-lg">
                        <div className="grid gap-md">
                            <h4>Small Size</h4>
                            <Tabs
                                items={[
                                    { id: 'sm1', label: 'Small' },
                                    { id: 'sm2', label: 'Tab' },
                                    { id: 'sm3', label: 'Size' }
                                ]}
                                activeTab="sm2"
                                onTabChange={() => { }}
                                variant="pills"
                                size="sm"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Medium Size (Default)</h4>
                            <Tabs
                                items={[
                                    { id: 'md1', label: 'Medium' },
                                    { id: 'md2', label: 'Tab' },
                                    { id: 'md3', label: 'Size' }
                                ]}
                                activeTab="md1"
                                onTabChange={() => { }}
                                variant="pills"
                                size="md"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Large Size</h4>
                            <Tabs
                                items={[
                                    { id: 'lg1', label: 'Large' },
                                    { id: 'lg2', label: 'Tab' },
                                    { id: 'lg3', label: 'Size' }
                                ]}
                                activeTab="lg3"
                                onTabChange={() => { }}
                                variant="pills"
                                size="lg"
                            />
                        </div>
                    </div>
                )
            },
            {
                title: 'Tab Features',
                component: (
                    <div className="space-y-lg">
                        <div className="grid gap-md">
                            <h4>Tabs with Icons</h4>
                            <Tabs
                                items={[
                                    { id: 'icon1', label: 'Home', icon: <span>🏠</span> },
                                    { id: 'icon2', label: 'Profile', icon: <span>👤</span> },
                                    { id: 'icon3', label: 'Settings', icon: <span>⚙️</span> }
                                ]}
                                activeTab="icon2"
                                onTabChange={() => { }}
                                variant="pills"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Tabs with Badges</h4>
                            <Tabs
                                items={[
                                    { id: 'badge1', label: 'Messages', badge: '5' },
                                    { id: 'badge2', label: 'Notifications', badge: '12' },
                                    { id: 'badge3', label: 'Tasks', badge: '3' }
                                ]}
                                activeTab="badge1"
                                onTabChange={() => { }}
                                variant="default"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Tabs with Icons and Badges</h4>
                            <Tabs
                                items={[
                                    { id: 'both1', label: 'Inbox', icon: <span>📧</span>, badge: '8' },
                                    { id: 'both2', label: 'Drafts', icon: <span>📝</span>, badge: '2' },
                                    { id: 'both3', label: 'Sent', icon: <span>📤</span> }
                                ]}
                                activeTab="both3"
                                onTabChange={() => { }}
                                variant="bordered"
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Disabled Tab</h4>
                            <Tabs
                                items={[
                                    { id: 'dis1', label: 'Active' },
                                    { id: 'dis2', label: 'Disabled', disabled: true },
                                    { id: 'dis3', label: 'Another Active' }
                                ]}
                                activeTab="dis1"
                                onTabChange={() => { }}
                                variant="default"
                            />
                        </div>
                    </div>
                )
            },
            {
                title: 'Full Width Tabs',
                component: (
                    <div className="space-y-lg">
                        <div className="grid gap-md">
                            <h4>Full Width Default</h4>
                            <Tabs
                                items={[
                                    { id: 'full1', label: 'Tab 1' },
                                    { id: 'full2', label: 'Tab 2' },
                                    { id: 'full3', label: 'Tab 3' }
                                ]}
                                activeTab="full2"
                                onTabChange={() => { }}
                                variant="default"
                                fullWidth
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Full Width Pills</h4>
                            <Tabs
                                items={[
                                    { id: 'fullpill1', label: 'Overview' },
                                    { id: 'fullpill2', label: 'Analytics' },
                                    { id: 'fullpill3', label: 'Settings' }
                                ]}
                                activeTab="fullpill1"
                                onTabChange={() => { }}
                                variant="pills"
                                fullWidth
                            />
                        </div>

                        <div className="grid gap-md">
                            <h4>Full Width Bordered</h4>
                            <Tabs
                                items={[
                                    { id: 'fullborder1', label: 'Dashboard' },
                                    { id: 'fullborder2', label: 'Reports' },
                                    { id: 'fullborder3', label: 'Settings' }
                                ]}
                                activeTab="fullborder3"
                                onTabChange={() => { }}
                                variant="bordered"
                                fullWidth
                            />
                        </div>
                    </div>
                )
            }
        ],
        dropdown: [
            {
                title: 'Dropdown Variants',
                component: (() => {
                    // Icons para demonstração
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
                        <div className="space-y-lg">
                            <div className="grid gap-md">
                                <h4>Color Variants</h4>
                                <div className="flex flex-wrap gap-md">
                                    <Dropdown
                                        variant="primary"
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
                        </div>
                    );
                })()
            },
            {
                title: 'Dropdown Sizes',
                component: (() => {
                    const menuItems = [
                        createDropdownItem('item1', 'Option 1', {
                            onClick: () => console.log('Option 1 clicked')
                        }),
                        createDropdownItem('item2', 'Option 2', {
                            onClick: () => console.log('Option 2 clicked')
                        }),
                        createDropdownItem('item3', 'Option 3', {
                            onClick: () => console.log('Option 3 clicked')
                        })
                    ];

                    return (
                        <div className="space-y-lg">
                            <div className="grid gap-md">
                                <h4>Size Variants</h4>
                                <div className="flex flex-wrap items-center gap-md">
                                    <Dropdown
                                        size="sm"
                                        placeholder="Small"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                    <Dropdown
                                        size="md"
                                        placeholder="Medium"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                    <Dropdown
                                        size="lg"
                                        placeholder="Large"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })()
            },
            {
                title: 'Dropdown Border Radius',
                component: (() => {
                    const menuItems = [
                        createDropdownItem('item1', 'Menu Item 1'),
                        createDropdownItem('item2', 'Menu Item 2'),
                        createDropdownDivider('div1'),
                        createDropdownItem('item3', 'Menu Item 3')
                    ];

                    return (
                        <div className="space-y-lg">
                            <div className="grid gap-md">
                                <h4>Border Radius Variants</h4>
                                <div className="flex flex-wrap gap-md">
                                    <Dropdown
                                        borderRadius="sm"
                                        bordered={true}
                                        placeholder="Small Radius"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                    <Dropdown
                                        borderRadius="md"
                                        bordered={true}
                                        placeholder="Medium Radius"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                    <Dropdown
                                        borderRadius="lg"
                                        bordered={true}
                                        placeholder="Large Radius"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                    <Dropdown
                                        borderRadius="xl"
                                        bordered={true}
                                        placeholder="XL Radius"
                                        variant='primary'
                                        items={menuItems}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })()
            },
            {
                title: 'Dropdown Border Options',
                component: (() => {
                    const menuItems = [
                        createDropdownItem('item1', 'Menu Item 1'),
                        createDropdownItem('item2', 'Menu Item 2'),
                        createDropdownDivider('div1'),
                        createDropdownItem('item3', 'Menu Item 3')
                    ];

                    return (
                        <div className="space-y-lg">
                            <div className="grid gap-md">
                                <h4>Border Variants</h4>
                                <div className="flex flex-wrap gap-md">
                                    <div className="space-y-sm">
                                        <label className="block text-sm font-medium text-text-secondary">With Border (Default)</label>
                                        <Dropdown
                                            variant="primary"
                                            placeholder="With Border"
                                            bordered={true}
                                            items={menuItems}
                                        />
                                    </div>
                                    <div className="space-y-sm">
                                        <label className="block text-sm font-medium text-text-secondary">Without Border</label>
                                        <Dropdown
                                            variant="primary"
                                            placeholder="No Border"
                                            bordered={false}
                                            items={menuItems}
                                        />
                                    </div>
                                    <div className="space-y-sm">
                                        <label className="block text-sm font-medium text-text-secondary">Secondary with Border</label>
                                        <Dropdown
                                            variant="secondary"
                                            placeholder="Secondary Bordered"
                                            bordered={true}
                                            items={menuItems}
                                        />
                                    </div>
                                    <div className="space-y-sm">
                                        <label className="block text-sm font-medium text-text-secondary">Secondary without Border</label>
                                        <Dropdown
                                            variant="secondary"
                                            placeholder="Secondary No Border"
                                            bordered={false}
                                            items={menuItems}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()
            },
            {
                title: 'Advanced Features',
                component: (() => {
                    const [selectedOption, setSelectedOption] = useState<string>('option1');

                    const selectionItems = [
                        createDropdownItem('option1', 'Option 1', {
                            selected: selectedOption === 'option1',
                            onClick: () => setSelectedOption('option1')
                        }),
                        createDropdownItem('option2', 'Option 2', {
                            selected: selectedOption === 'option2',
                            onClick: () => setSelectedOption('option2')
                        }),
                        createDropdownItem('option3', 'Option 3', {
                            selected: selectedOption === 'option3',
                            onClick: () => setSelectedOption('option3')
                        }),
                        createDropdownItem('option4', 'Option 4 (Disabled)', {
                            disabled: true
                        })
                    ];

                    const renderCustomTemplate = (data: any) => (
                        <div className="p-md">
                            <h4 className="text-sm font-bold mb-sm text-text-primary">Users Online</h4>
                            {data.users.map((user: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center p-sm hover:bg-bg-tertiary rounded cursor-pointer"
                                    onClick={() => console.log(`Selected user: ${user}`)}
                                >
                                    <div className="w-6 h-6 bg-success rounded-full mr-sm flex items-center justify-center">
                                        <span className="text-xs text-white">{user[0]}</span>
                                    </div>
                                    <span className="text-text-primary">{user}</span>
                                </div>
                            ))}
                        </div>
                    );

                    return (
                        <div className="space-y-lg">
                            <div className="grid gap-md">
                                <h4>Selection Dropdown</h4>
                                <div className="max-w-xs">
                                    <Dropdown
                                        variant="primary"
                                        placeholder="Choose an option"
                                        items={selectionItems}
                                    />
                                    <p className="text-text-secondary text-sm mt-sm">
                                        Selected: {selectedOption}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-md">
                                <h4>Full Width</h4>
                                <Dropdown
                                    variant="primary"
                                    fullWidth
                                    placeholder="Full Width Dropdown"
                                    items={selectionItems}
                                />
                            </div>

                            <div className="grid gap-md">
                                <h4>Custom Template</h4>
                                <div className="max-w-xs">
                                    <Dropdown
                                        variant="primary"
                                        placeholder="Users"
                                        template={renderCustomTemplate}
                                        templateData={{ users: ['Alice', 'Bob', 'Charlie'] }}
                                        closeOnSelect={true}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-md">
                                <h4>Custom Content</h4>
                                <div className="max-w-xs">
                                    <Dropdown variant="primary" placeholder="Custom Content">
                                        <div className="p-md">
                                            <h4 className="text-sm font-bold mb-sm text-text-primary">Quick Actions</h4>
                                            <button className="w-full text-left p-sm hover:bg-bg-tertiary rounded mb-xs text-text-primary">
                                                Create new file
                                            </button>
                                            <button className="w-full text-left p-sm hover:bg-bg-tertiary rounded mb-xs text-text-primary">
                                                Open folder
                                            </button>
                                            <div className="border-t border-border my-sm"></div>
                                            <div className="p-sm">
                                                <label className="block text-xs text-text-secondary mb-xs">
                                                    Search files:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-bg-primary border border-border rounded px-sm py-xs text-text-primary text-sm"
                                                    placeholder="Type to search..."
                                                />
                                            </div>
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="grid gap-md">
                                <h4>Disabled State</h4>
                                <div className="max-w-xs">
                                    <Dropdown
                                        variant="primary"
                                        placeholder="Disabled Dropdown"
                                        items={selectionItems}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })()
            },
            {
                title: 'Code Examples',
                component: (
                    <div className="space-y-lg">
                        <CodeExample
                            title="Basic Dropdown Menu"
                            description="Example of a dropdown with icons and dividers"
                            code={`import { Dropdown, createDropdownItem, createDropdownDivider } from '../ui/dropdown';

const menuItems = [
  createDropdownItem('profile', 'Profile', { 
    icon: <UserIcon />,
    onClick: () => console.log('Profile clicked')
  }),
  createDropdownItem('settings', 'Settings', { 
    icon: <SettingsIcon />,
    onClick: () => console.log('Settings clicked')
  }),
  createDropdownDivider('divider1'),
  createDropdownItem('logout', 'Logout', { 
    icon: <LogoutIcon />,
    onClick: () => console.log('Logout clicked')
  })
];

<Dropdown
  variant="primary"
  placeholder="User Menu"
  items={menuItems}
  onSelect={(item) => console.log('Selected:', item)}
/>`}
                        >
                            <Dropdown
                                variant="primary"
                                placeholder="User Menu"
                                items={(() => {
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
                                    return [
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
                                })()}
                                onSelect={(item) => console.log('Selected:', item)}
                            />
                        </CodeExample>

                        <CodeExample
                            title="Custom Template Dropdown"
                            description="Example using template prop for custom rendering"
                            code={`const renderTemplate = (data) => (
  <div className="p-md">
    <h4 className="text-sm font-bold mb-sm">Users Online</h4>
    {data.users.map((user, index) => (
      <div 
        key={index} 
        className="flex items-center p-sm hover:bg-bg-tertiary rounded cursor-pointer"
        onClick={() => console.log(\`Selected user: \${user}\`)}
      >
        <div className="w-6 h-6 bg-success rounded-full mr-sm">
          <span className="text-xs text-white">{user[0]}</span>
        </div>
        <span>{user}</span>
      </div>
    ))}
  </div>
);

<Dropdown
  placeholder="Users"
  template={renderTemplate}
  templateData={{ users: ['Alice', 'Bob', 'Charlie'] }}
  closeOnSelect={true}
/>`}
                        >
                            <Dropdown
                                variant="primary"
                                placeholder="Users"
                                template={(data: any) => (
                                    <div className="p-md">
                                        <h4 className="text-sm font-bold mb-sm text-text-primary">Users Online</h4>
                                        {data.users.map((user: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-sm hover:bg-bg-tertiary rounded cursor-pointer"
                                                onClick={() => console.log(`Selected user: ${user}`)}
                                            >
                                                <div className="w-6 h-6 bg-success rounded-full mr-sm flex items-center justify-center">
                                                    <span className="text-xs text-white">{user[0]}</span>
                                                </div>
                                                <span className="text-text-primary">{user}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                templateData={{ users: ['Alice', 'Bob', 'Charlie'] }}
                                closeOnSelect={true}
                            />
                        </CodeExample>
                    </div>
                )
            }
        ],
        examples: [
            {
                title: 'Code Examples',
                component: (
                    <div className="space-y-lg">
                        <CodeExample
                            title="Button with Icon"
                            description="Example of a primary button with left icon"
                            code={`<Button 
  variant="primary" 
  size="lg" 
  leftIcon={<span>🚀</span>}
>
  Launch Application
</Button>`}
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                leftIcon={<span>🚀</span>}
                            >
                                Launch Application
                            </Button>
                        </CodeExample>

                        <CodeExample
                            title="Tabs with State Management"
                            description="Complete tab example with state management and content switching"
                            code={`const [activeTab, setActiveTab] = useState('overview');

const tabItems = [
  { id: 'overview', label: 'Overview', icon: <span>📊</span> },
  { id: 'settings', label: 'Settings', icon: <span>⚙️</span> },
  { id: 'help', label: 'Help', badge: '2' }
];

return (
  <div>
    <Tabs
      items={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      variant="pills"
      size="md"
    />
    
    <div className="mt-lg">
      {activeTab === 'overview' && <div>Overview Content</div>}
      {activeTab === 'settings' && <div>Settings Content</div>}
      {activeTab === 'help' && <div>Help Content</div>}
    </div>
  </div>
);`}
                        >
                            <div>
                                <Tabs
                                    items={[
                                        { id: 'overview', label: 'Overview', icon: <span>📊</span> },
                                        { id: 'settings', label: 'Settings', icon: <span>⚙️</span> },
                                        { id: 'help', label: 'Help', badge: '2' }
                                    ]}
                                    activeTab="overview"
                                    onTabChange={() => { }}
                                    variant="pills"
                                    size="md"
                                />

                                <div className="mt-lg p-md bg-surface-2 rounded-md">
                                    <div>Overview Content - Dashboard and statistics would go here</div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                )
            }
        ]
    };

    const tabs: TabItem[] = [
        { id: 'buttons', label: 'Buttons' },
        { id: 'cards', label: 'Cards' },
        { id: 'tabs', label: 'Tabs', icon: <span>📑</span> },
        { id: 'dropdown', label: 'Dropdown', icon: <span>📋</span> },
        { id: 'utilities', label: 'Utilities' },
        { id: 'layout', label: 'Layout' },
        { id: 'forms', label: 'Forms' },
        { id: 'effects', label: 'Effects' },
        { id: 'examples', label: '📝 Examples' }
    ];

    return (
        <div className="p-lg">
            <div className="mb-lg">
                <h1 className="text-3xl font-bold mb-sm">Style Debug Component</h1>
                <p className="text-secondary">
                    Comprehensive showcase of all available components, utilities, and styling options.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-lg">
                <Tabs
                    items={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    variant="bordered"
                    size="md"
                />
            </div>

            {/* Content Sections */}
            <div className="space-y-xl">
                {sections[activeTab]?.map((section, index) => (
                    <Card
                        key={index}
                        variant="outlined"
                        padding="lg"
                        className={activeTab === 'dropdown' ? 'card--allow-overflow' : ''}
                    >
                        <div className="mb-lg">
                            <h2 className="text-xl font-semibold mb-sm">{section.title}</h2>
                        </div>
                        <div>
                            {section.component}
                        </div>
                    </Card>
                ))}
            </div>

            {/* CSS Classes Reference */}
            <Card variant="glass" padding="lg" className="mt-xl">
                <h2 className="text-xl font-semibold mb-md">Quick CSS Classes Reference</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg text-sm">
                    <div>
                        <h3 className="font-semibold mb-sm">Spacing</h3>
                        <code className="block">
                            .m-xs, .m-sm, .m-md, .m-lg, .m-xl<br />
                            .p-xs, .p-sm, .p-md, .p-lg, .p-xl<br />
                            .mt-*, .mr-*, .mb-*, .ml-*<br />
                            .pt-*, .pr-*, .pb-*, .pl-*<br />
                            .mx-*, .my-*, .px-*, .py-*
                        </code>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-sm">Display & Flex</h3>
                        <code className="block">
                            .block, .inline, .inline-block<br />
                            .flex, .inline-flex<br />
                            .flex-row, .flex-col<br />
                            .justify-start, .justify-center<br />
                            .justify-between, .justify-around<br />
                            .items-start, .items-center<br />
                            .items-end, .items-stretch
                        </code>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-sm">Typography</h3>
                        <code className="block">
                            .text-xs, .text-sm, .text-base<br />
                            .text-lg, .text-xl, .text-2xl<br />
                            .font-light, .font-normal<br />
                            .font-medium, .font-semibold<br />
                            .font-bold<br />
                            .text-left, .text-center, .text-right
                        </code>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-sm">Tabs Component</h3>
                        <code className="block">
                            .tabs, .tabs__list, .tabs__tab<br />
                            .tabs--default, .tabs--pills<br />
                            .tabs--underline, .tabs--bordered<br />
                            .tabs--sm, .tabs--md, .tabs--lg<br />
                            .tabs--full-width<br />
                            .tabs__icon, .tabs__badge
                        </code>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StyleDebug;
