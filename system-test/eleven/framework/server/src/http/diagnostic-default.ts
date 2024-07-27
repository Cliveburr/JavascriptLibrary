import { IDiagnostic, DiagnosticLevel } from "./models";

export class DefaultDiagnostic implements IDiagnostic {
    
    public constructor(
        private diagnosticLevel: DiagnosticLevel = DiagnosticLevel.Normal
    ) {
    }

    public log(text: any, level?: DiagnosticLevel): void {
        if ((level || DiagnosticLevel.Normal) <= this.diagnosticLevel) {
            if (level == DiagnosticLevel.Error) {
                console.error(text);
            }
            else {
                console.log(text);
            }
        }
    }
}