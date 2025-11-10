import React from "react";
import { useAuth } from "../contexts/AuthContext";

const AuthDebug = () => {
  const { user, token, logout } = useAuth();

  return (
    <div className="p-3 text-xs bg-card/90 border border-border rounded-md mt-4">
      <h4 className="font-medium mb-2">Auth Debug</h4>
      <div className="mb-1">
        <strong>Token:</strong>
        <div className="break-words">{token ?? "(none)"}</div>
      </div>
      <div className="mb-2">
        <strong>User:</strong>
        <pre className="whitespace-pre-wrap">{JSON.stringify(user, null, 2) || "(none)"}</pre>
      </div>
      <div>
        <button onClick={logout} className="text-xs text-red-500 underline">Logout (debug)</button>
      </div>
    </div>
  );
};

export default AuthDebug;
