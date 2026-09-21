import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";

// no se arma al importar el archivo, solo la primera vez que hace falta validar un token de verdad
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function obtenerJwks() {
    if (!jwks) {
        jwks = createRemoteJWKSet(
            new URL(`${process.env.KEYCLOAK_INTERNAL_URL}/realms/${process.env.REALM_NAME}/protocol/openid-connect/certs`)
        );
    }
    return jwks;
}

export interface UsuarioAutenticado {
    id: string;
    username: string;
    roles: string[];
}

declare module "express-serve-static-core" {
    interface Request {
        usuario?: UsuarioAutenticado;
    }
}


// 401: valida que venga un token y que sea valido de verdad (firma, expiracion, emisor)
export async function requiereToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // si no viene con "Bearer " ni vale la pena intentar verificarlo
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "falta el token de acceso" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    // el issuer tiene que ser el mismo que usa el frontend para pedir el token,
    // no la url interna de docker (esa es solo para buscar las llaves)
    const { payload } = await jwtVerify(token, obtenerJwks(), {
      issuer: process.env.KEYCLOAK_ISSUER,
    });

    req.usuario = {
      id: payload.sub as string,
      username: payload.preferred_username as string,
      roles: (payload.realm_access as { roles?: string[] } | undefined)?.roles ?? [],
    };

    next();
  } catch (error) {
    console.error("Token inválido:", error);
    return res.status(401).json({ error: "token inválido o expirado" });
  }
}

// 403: el token es valido pero no trae el rol que la ruta exige
export function requiereRol(rol: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario?.roles.includes(rol)) {
      return res.status(403).json({ error: `falta el rol '${rol}'` });
    }
    next();
  };
}
