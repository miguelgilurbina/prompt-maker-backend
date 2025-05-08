module.exports = {
    parser: '@typescript-eslint/parser', // 1. Especifica el parser para TypeScript
    extends: [
        'plugin:@typescript-eslint/recommended', // 2. Usa reglas recomendadas para TypeScript
        'prettier',
        'plugin:prettier/recommended', //
    ],
    parserOptions: {
        ecmaVersion: 2020, // Permite el parsing de características modernas de ECMAScript
        sourceType: 'module', // Permite el uso de imports/exports
    },
    rules: {
        // Aquí puedes añadir o sobrescribir reglas. Por ejemplo:
        // '@typescript-eslint/no-explicit-any': 'warn', // Advertir en lugar de error para 'any'
        // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Desactivar console.log en desarrollo
    },
};