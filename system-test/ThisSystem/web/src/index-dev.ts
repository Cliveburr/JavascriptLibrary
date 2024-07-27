import * as tool from 'tool';

const dev = new tool.ServerDevSystem(__dirname, './main');

dev.runOnWatcher();