

module Fire {

    export module Style {

        export class StyleSheet extends Fire.Http.Element<StyleSheet> {

            public Rules: Fire.Colletion.Dictonary<any>;
            private m_Read: boolean;

            constructor() {
                this.m_Read = false;
                this.Tag = "style";
                super();
                this.HTMLElement.setAttribute("type", "text/css");
            }

            public CreateRule(selector: string, cssText?: string): StyleRule {
                var sheet = <HTMLStyleElement><any>this.HTMLElement;
                var style = document.createTextNode(selector + " { } ");
                sheet.appendChild(style);
                var rules = (<any>sheet).sheet.rules || (<any>sheet).sheet.cssRules;
                return new StyleRule(rules[rules.length - 1]);
            }

        }

        /*export class StyleProperty {

            private m_Name: string;
            private m_Father: StyleRule;

            constructor(element: StyleRule, name: string) {
                this.m_Father = element;
                this.m_Name = name;
            }

            public Set(value: string): StyleRule {
                this.m_Father.CSSProperties[this.m_Name] = value;
                return this.m_Father;
            }

            public Get(): string {
                return this.m_Father.CSSProperties[this.m_Name];
            }

        }*/

        export class StyleRule {

            public Rule: CSSStyleRule;
            public Style: Style.StyleProperties

            constructor(rule: CSSStyleRule) {
                this.Rule = rule;
                this.Style = this.Rule.style;
            }

        }

        export class Cursor {
            public static CrossHair: string = "crosshair";
            public static Help: string = "help";
        }

        export interface StyleProperties {
            cursor: Cursor;
        }

    }

}