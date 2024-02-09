class RefreshTokenEntity {
  id?: string;
  id_user: string;
  token: string;
  expires: Date;

  constructor(id_user: string, token: string, expires: Date, id?: string) {
    this.id_user = id_user;
    this.token = token;
    this.expires = expires;
    this.id = id;
  }
}

export default RefreshTokenEntity;
