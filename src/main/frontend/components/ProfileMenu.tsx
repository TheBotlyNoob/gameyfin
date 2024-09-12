import {useAuth} from "Frontend/util/auth";
import {GearFine, Question, SignOut, User} from "@phosphor-icons/react";
import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";

export default function ProfileMenu() {
    const {state, logout} = useAuth();
    const navigate = useNavigate();

    const profileMenuItems = [
        {
            label: "My Profile",
            icon: <User/>,
            onClick: () => navigate('/settings/profile')
        },
        {
            label: "Administration",
            icon: <GearFine/>,
            onClick: () => navigate("/administration/libraries"),
            showIf: state.user?.roles?.some(a => a?.includes("ADMIN"))
        },
        {
            label: "Help",
            icon: <Question/>,
            onClick: () => window.open("https://github.com/gameyfin/gameyfin/tree/v2", "_blank")
        },
        {
            label: "Sign Out",
            icon: <SignOut/>,
            onClick: () => logout(),
            color: "primary"
        },
    ];

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar showFallback
                        radius="full"
                        as="button"
                        className="transition-transform size-8"
                        classNames={{
                            base: "gradient-primary",
                            icon: "text-background/80"
                        }}
                />
            </DropdownTrigger>
            <DropdownMenu>
                {/* @ts-ignore */}
                {profileMenuItems.map(({label, icon, onClick, showIf, color}) => {
                    return (
                        (showIf === undefined || showIf === true) ?
                            <DropdownItem
                                key={label}
                                onClick={onClick}
                                startContent={<div color={color}>{icon}</div>}
                                /* @ts-ignore */
                                color={color ? color : ""}
                                className={`text-${color} hover:bg-primary/20`}
                            >
                                {label}
                            </DropdownItem> : null
                    );
                })}
            </DropdownMenu>
        </Dropdown>
    );
}