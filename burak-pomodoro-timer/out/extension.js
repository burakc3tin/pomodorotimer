"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
let timer = null;
let remainingTime = 1500; // 25 minutes in seconds
let statusBar;
function activate(context) {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.command = 'extension.startPomodoroTimer';
    statusBar.show();
    context.subscriptions.push(vscode.commands.registerCommand('extension.startPomodoroTimer', startPomodoroTimer), vscode.commands.registerCommand('extension.stopPomodoroTimer', stopPomodoroTimer), vscode.commands.registerCommand('extension.resetPomodoroTimer', resetPomodoroTimer));
}
exports.activate = activate;
function startPomodoroTimer() {
    if (timer) {
        vscode.window.showInformationMessage('Pomodoro Timer is already running!');
        return;
    }
    timer = setInterval(() => {
        remainingTime -= 1;
        updateStatusBar();
        if (remainingTime <= 0) {
            clearInterval(timer);
            timer = null;
            remainingTime = 1500; // Reset to 25 minutes
            vscode.window.showInformationMessage('Pomodoro session completed!');
            updateStatusBar();
        }
    }, 1000);
    statusBar.command = 'extension.stopPomodoroTimer';
    updateStatusBar();
}
function stopPomodoroTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        statusBar.command = 'extension.startPomodoroTimer';
        updateStatusBar();
    }
}
function resetPomodoroTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    remainingTime = 1500;
    statusBar.command = 'extension.startPomodoroTimer';
    updateStatusBar();
}
function updateStatusBar() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    statusBar.text = `Pomodoro Timer: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
function deactivate() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (statusBar) {
        statusBar.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map