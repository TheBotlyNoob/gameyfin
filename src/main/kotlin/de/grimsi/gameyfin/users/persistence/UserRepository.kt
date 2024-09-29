package de.grimsi.gameyfin.users.persistence

import de.grimsi.gameyfin.core.Role
import de.grimsi.gameyfin.users.entities.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {
    fun existsByUsername(userName: String): Boolean
    fun existsByEmail(email: String): Boolean
    fun findByUsername(userName: String): User?
    fun findByEmail(email: String): User?
    fun findByOidcProviderId(oidcProviderId: String): User?
    fun countUserByRolesContains(role: Role): Int
}