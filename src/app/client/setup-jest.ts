import 'jest-preset-angular/setup-jest';
import './jest-global-mocks';
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;