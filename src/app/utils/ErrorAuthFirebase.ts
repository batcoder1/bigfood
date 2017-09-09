
export namespace ErrorAuthFirebase {
    export function convertMessage(code: string): string {
        switch (code) {
            case 'auth/user-disabled': {
                return 'Sorry your user is disabled.';
            }
            case 'auth/user-not-found': {
                return 'Sorry user not found.';
            }

            case 'auth/wrong-password': {
              return 'Sorry, incorrect password entered. Please try again.';
            }

            default: {
                return 'Login error try again later.';
            }
        }
    }
}