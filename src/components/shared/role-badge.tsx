import { Badge } from "../ui/badge"

   export default function RoleBadge({ role }: { role: string }) {
        let badgeClass = ""
        let roleName = ""
        switch (role) {
            case "admin":
            badgeClass = "bg-red-100 text-red-700 border-red-200"
            roleName = "Админ"
            break
            case "manager":
            badgeClass = "bg-blue-100 text-blue-700 border-blue-200"
            roleName = "Менеджер"
            break
            case "user":
            badgeClass = "bg-green-100 text-green-700 border-green-200"
            roleName = "Пользователь"
            break
            default:
            badgeClass = "bg-gray-100 text-gray-700 border-gray-200"
        }

        return (
            <Badge variant="outline" className={badgeClass}>
            {roleName}
            </Badge>
        )
    }