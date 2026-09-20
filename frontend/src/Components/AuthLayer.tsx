import { useEffect, useState, type FC, type ReactNode } from "react";
import { RUTA_ESTANDAR, RUTAS_API, TIMEOUT_MAX } from "../Constants";
import { hasAuthParams, useAuth } from "react-oidc-context";


const authHealt = async (): Promise<boolean> => {

  try {
    const respuesta = await fetch(RUTA_ESTANDAR + RUTAS_API.health, {
      signal: AbortSignal.timeout(TIMEOUT_MAX)
    });

    return respuesta.ok;

  } catch (error: any) {
    return false;
  }

}

interface protectedApps {
  children: ReactNode
};

export const AuthLayer: FC<protectedApps> = (apps) => {
  const { children } = apps;

  const [estaPendiente, setEstaPendiente] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setEstaPendiente(await authHealt());
    }

    checkHealth();
  }, []);

  const auth = useAuth();
  const [hasTriedSigningIn, setHasTriedSigningIn] = useState(false);

  useEffect(() => {
    if (estaPendiente) {
      return;
    }
    if (!(hasAuthParams() || auth.isAuthenticated || auth.activeNavigator || auth.isAuthenticated || hasTriedSigningIn)) {
      void auth.signinRedirect();
      setHasTriedSigningIn(true);
    }
  }, [auth, hasTriedSigningIn, estaPendiente]);

  const estaCargando = estaPendiente || auth.isLoading;

  if (estaCargando) {
    return <h1>Loading...</h1>
  }
  if (!auth.isAuthenticated) {
    return (
      <>
        <h1>No se ha podido iniciar sesión</h1>
      </>
    )
  }

  return <>{children}</>;
}

export default AuthLayer
