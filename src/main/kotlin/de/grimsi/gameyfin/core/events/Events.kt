package de.grimsi.gameyfin.core.events

import de.grimsi.gameyfin.shared.token.Token
import de.grimsi.gameyfin.shared.token.TokenType.PasswordReset
import de.grimsi.gameyfin.users.entities.User
import org.springframework.context.ApplicationEvent

class UserInvitationEvent(source: Any) : ApplicationEvent(source)

class UserRegistrationWaitingForApprovalEvent(source: Any, val newUser: User) : ApplicationEvent(source)

class UserRegistrationEvent(source: Any, val newUser: User, val baseUrl: String) : ApplicationEvent(source)

class RegistrationAttemptWithExistingEmailEvent(source: Any, val existingUser: User, val baseUrl: String) :
    ApplicationEvent(source)

class PasswordResetRequestEvent(source: Any, val token: Token<PasswordReset>, val baseUrl: String) :
    ApplicationEvent(source)

class GameRequestEvent(source: Any) : ApplicationEvent(source)

class GameRequestApprovalEvent(source: Any) : ApplicationEvent(source)