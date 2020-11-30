import { stopApp } from './hooks';
const fs = require('fs');
const path  =require('path');
export const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf8'))
import './specs/OnboardingPage.test';
import './specs/ContentImport.test';
import './specs/ContentPlay.test';
import './specs/ContentDelete.test';
// import './specs/ContentDownload.test';
import './specs/Profile.test'
import './specs/Telemetry.test';

stopApp()