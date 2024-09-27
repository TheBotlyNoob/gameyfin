package de.grimsi.gameyfin.messages.templates

sealed class MessageTemplates(
    val key: String,
    val name: String,
    val description: String,
    val availablePlaceholders: List<String> = emptyList()
) {
    data object UserInvitation : MessageTemplates(
        "user-invitation",
        "User Invitation",
        "Template for the invitation message for new users",
        listOf("invitationLink")
    )

    data object WaitingForApproval : MessageTemplates(
        "waiting-for-approval",
        "Waiting for approval",
        "Template for the waiting for approval message for new users",
        listOf("username")
    )

    data object Welcome : MessageTemplates(
        "welcome",
        "Welcome",
        "Template for the welcome message for new users",
        listOf("username", "baseUrl")
    )

    data object RegistrationAttemptWithExistingEmail : MessageTemplates(
        "email-already-registered",
        "Someone tried to register with your email",
        "Template for the email already registered message",
        listOf("username", "passwordResetLink")
    )

    data object EmailConfirmation : MessageTemplates(
        "email-confirmation",
        "Email Confirmation",
        "Template for the email confirmation message",
        listOf("username", "confirmationLink")
    )

    data object PasswordResetRequest : MessageTemplates(
        "password-reset-request",
        "Password Reset Request",
        "Template for the password reset request message",
        listOf("username", "resetLink")
    )
}