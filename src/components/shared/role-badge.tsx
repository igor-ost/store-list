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
        case "accountant":
            badgeClass = "bg-green-100 text-green-700 border-green-200"
            roleName = "Бухгалтер"
            break
        case "technologist":
            badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200"
            roleName = "Технолог"
            break
        case "seamstress":
            badgeClass = "bg-purple-100 text-purple-700 border-purple-200"
            roleName = "Швея"
            break
        case "cutter":
            badgeClass = "bg-pink-100 text-pink-700 border-pink-200"
            roleName = "Закройщик"
            break
        default:
            badgeClass = "bg-gray-100 text-gray-700 border-gray-200"
            roleName = role
    }

    return (
        <Badge variant="outline" className={badgeClass}>
            {roleName}
        </Badge>
    )
}
