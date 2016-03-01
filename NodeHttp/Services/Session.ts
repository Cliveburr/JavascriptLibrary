import httpServer = require('../Http/HttpServer');
import system = require('../System');
var cookies = require("cookies");

module internal {
    export class SessionServices implements httpServer.IServices {
        public static instance: SessionServices;
        public name: string;
        public type: httpServer.ServicesType;
        public sessions: system.AutoDictonary<SessionInstance>;
        public on_create = new system.Event<(service: any) => void>();
        public on_destroy = new system.Event<(service: any) => void>(); 

        constructor() {
            this.name = 'session';
            this.type = httpServer.ServicesType.PerRequest;
            this.sessions = new system.AutoDictonary<SessionInstance>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 24);
            SessionServices.instance = this;
        }

        public getInstance(ctx: httpServer.IContext): SessionInstance {
            var ckos = new cookies(ctx.request, ctx.response);
            var sid: string = ckos.get("SID");

            var session: SessionInstance = null;

            if (!sid || !this.sessions.has(sid)) {
                sid = this.sessions.generateID();

                session = new SessionInstance();
                if (this.on_create)
                    this.on_create.raise(session);

                session.sid = sid;
                this.sessions.set(sid, session);
            }
            else {
                session = this.sessions.get(sid);
            }

            if (session.timeOutEvent) {
                clearTimeout(session.timeOutEvent);
            }
            session.timeOutEvent = setTimeout(() => this.release_session(session), session.timeOut * 1000);

            //var expires = new Date(Date.now() + (session.timeOut * 1000));
            ckos.set("SID", sid, {
                domain: '',
                path: '/',
                //expires: expires,
                secure: false,
                httpOnly: false
            });

            return session;
        }

        private release_session(session: SessionInstance): void {
            this.sessions.remove(session.sid);
        }
    }

    export class SessionInstance {
        public sid: string;
        public timeOut: number;
        public timeOutEvent: NodeJS.Timer;
        public data: any;

        constructor() {
            this.timeOut = 60;
        }
    }

    export class Session implements httpServer.IPipeline {
        public static $inject = ['session'];
        public static $reusable = false;

        constructor(
            private _session: SessionServices) {
        }

        public process(ctx: httpServer.IContext, next: () => void): void {
            // Just to force the session to be created
            next();
        }
    }
}

export = internal;