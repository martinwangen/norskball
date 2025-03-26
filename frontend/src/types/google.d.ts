interface Window {
  gapi: {
    load(api: string, callback: () => void): void;
    auth2: {
      init(params: { client_id: string; scope: string }): void;
      getAuthInstance(): {
        signIn(): Promise<{
          getBasicProfile(): {
            getEmail(): string;
            getName(): string;
            getImageUrl(): string;
          };
          getAuthResponse(): {
            id_token: string;
          };
        }>;
        signOut(): Promise<void>;
      };
    };
  };
}
