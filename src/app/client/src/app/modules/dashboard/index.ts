// Export services and interfaces but NOT the modules to avoid circular dependency
export * from './services';
export * from './interfaces';
// DO NOT export modules here - they should be imported directly
// export * from './dashboard.module';
// export * from './dashboard-shared.module';
