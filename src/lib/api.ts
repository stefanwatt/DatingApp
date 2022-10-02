import {supabaseFunctionsUrl} from "./constants"

type Method = "GET"|"DELETE"|"POST"|"PUT"

interface Input{
  method: Method;
  path: string;
  data?:any;
  token:string
}

interface Opts{
  method:Method;
  headers: any;
  body?: any;
}

const send = async({ method, path, data, token }:Input) => {
	const opts:Opts = { method, headers: {} };
	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	return fetch(`${supabaseFunctionsUrl}/${path}`, opts)
		.then((r) => r.text())
		.then((json) => {
			try {
				var resParsed = JSON.parse(json);

				if (resParsed?.status === 'error') {
					console.log(`API response error from ${supabaseFunctionsUrl}/${path}: ${json}`);
				}

				return resParsed;
			} catch (err) {
				return json;
			}
		});
}

export const get = (path:string, token:string) => {
	return send({ method: 'GET', path, token });
}

export const del = (path:string, token:string) => {
	return send({ method: 'DELETE', path, token });
}

export const post = (path:string, data:any, token:string) => {
	return send({ method: 'POST', path, data, token });
}

export const put = (path:string, data:any, token:string) => {
	return send({ method: 'PUT', path, data, token });
}
