import { Tagger } from './tagger';
import { register } from './tags';

var tg = new Tagger();
register(tg);
tg.run();