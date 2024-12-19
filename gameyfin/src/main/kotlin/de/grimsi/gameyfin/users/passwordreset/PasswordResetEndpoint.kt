package de.grimsi.gameyfin.users.passwordreset

import com.vaadin.flow.server.auth.AnonymousAllowed
import com.vaadin.hilla.Endpoint
import de.grimsi.gameyfin.core.Role
import de.grimsi.gameyfin.shared.token.TokenDto
import de.grimsi.gameyfin.shared.token.TokenValidationResult
import de.grimsi.gameyfin.users.UserService
import jakarta.annotation.security.RolesAllowed

@Endpoint
@AnonymousAllowed
class PasswordResetEndpoint(
    private val passwordResetService: PasswordResetService,
    private val userService: UserService
) {

    fun requestPasswordReset(email: String) {
        passwordResetService.requestPasswordReset(email)

        // No return value to prevent enumeration attacks
    }

    @RolesAllowed(Role.Names.ADMIN)
    fun createPasswordResetTokenForUser(username: String): TokenDto {
        return passwordResetService.generate(username)
    }

    fun resetPassword(secret: String, newPassword: String): TokenValidationResult {
        return passwordResetService.resetPassword(secret, newPassword)
    }
}