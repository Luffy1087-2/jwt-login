export default function VerifyEnvVars() {
  if (!process.env.MONGO_INITDB_ROOT_USERNAME) throw new TypeError('MONGO_INITDB_ROOT_USERNAME must be defined');
  if (!process.env.MONGO_INITDB_ROOT_PASSWORD) throw new TypeError('MONGO_INITDB_ROOT_PASSWORD must be defined');
  if (!process.env.MONGO_INITDB_DATABASE) throw new TypeError('MONGO_INITDB_DATABASE must be defined');
  if (!process.env.MONGO_SERVICE_NAME) throw new TypeError('MONGO_SERVICE_NAME must be defined');
  if (!process.env.JWT_ACCESS_TOKEN) throw new TypeError('JWT_ACCESS_TOKEN must be defined');
  if (!process.env.JWT_REFRESH_TOKEN) throw new TypeError('JWT_REFRESH_TOKEN must be defined');
};