import {useAuth} from "Frontend/util/auth";
import {useLayoutEffect, useState} from "react";
import {XCircle} from "@phosphor-icons/react";
import {Button, Card, CardBody, CardHeader, Input, Link} from "@nextui-org/react";
import {Alert, AlertDescription, AlertTitle} from "Frontend/@/components/ui/alert";
import {useNavigate} from "react-router-dom";

export default function LoginView() {
    const {state, login} = useAuth();
    const [hasError, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [url, setUrl] = useState<string>();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (state.user) {
            const path = url ? new URL(url, document.baseURI).pathname : '/'
            navigate(path, {replace: true});
        }
    }, [state.user]);

    return (
        <div className="flex size-full gradient-primary">
            <Card className="m-auto p-12">
                <CardHeader>
                    <img
                        className="h-28 w-full content-center"
                        src="/images/Logo.svg"
                        alt="Gameyfin Logo"
                    />
                </CardHeader>
                <CardBody className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    {hasError &&
                        <Alert className="mb-4" variant="destructive">
                            <XCircle weight="fill" className="size-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Wrong username and/or password</AlertDescription>
                        </Alert>
                    }
                    <form
                        className="mb-1 flex flex-col gap-6"
                        onSubmit={async e => {
                            e.preventDefault();
                            if (typeof username === "string" && password != null) {
                                setLoading(true);
                                const {defaultUrl, error, redirectUrl} = await login(username, password);
                                if (error) {
                                    setError(true);
                                } else {
                                    setUrl(redirectUrl ?? defaultUrl ?? '/');
                                }
                                setLoading(false);
                            }
                        }}
                    >
                        <label htmlFor="username">
                            <h6 color="blue-gray" className="-mb-3">
                                Username
                            </h6>
                        </label>
                        <Input
                            onChange={(event: any) => {
                                setUsername(event.target.value);
                            }}
                            id="username"
                            type="text"
                            autoComplete="username"
                            placeholder=""
                        />
                        <label htmlFor="current-password">
                            <h6 color="blue-gray" className="-mb-3">
                                Password
                            </h6>
                        </label>
                        <Input
                            onChange={(event: any) => {
                                setPassword(event.target.value);
                            }}
                            id="current-password"
                            type="password"
                            autoComplete="current-password"
                            placeholder=""
                        />
                        <div className="flex justify-between items-center">
                            <Link color="foreground" underline="always">Forgot password?</Link>
                            <Button color="primary" type="submit" isLoading={loading}>
                                {loading ? "" : "Log in"}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}