import * as vscode from 'vscode';

let timer: NodeJS.Timeout | null = null;
let remainingTime = 1500; // 25 minutes in seconds
let statusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.command = 'extension.startPomodoroTimer';
  statusBar.show();

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.startPomodoroTimer', startPomodoroTimer),
    vscode.commands.registerCommand('extension.stopPomodoroTimer', stopPomodoroTimer),
    vscode.commands.registerCommand('extension.resetPomodoroTimer', resetPomodoroTimer)
  );
}

function startPomodoroTimer() {
  if (timer) {
    vscode.window.showInformationMessage('Pomodoro Timer is already running!');
    return;
  }

  timer = setInterval(() => {
    remainingTime -= 1;
    updateStatusBar();

    if (remainingTime <= 0) {
      clearInterval(timer as NodeJS.Timeout);
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

export function deactivate() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (statusBar) {
    statusBar.dispose();
  }
}
