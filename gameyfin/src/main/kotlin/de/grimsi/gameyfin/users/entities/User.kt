package de.grimsi.gameyfin.users.entities

import de.grimsi.gameyfin.core.Role
import de.grimsi.gameyfin.core.security.EncryptionConverter
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.springframework.security.oauth2.core.oidc.user.OidcUser


@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long? = null,

    @NotNull
    @Column(unique = true)
    var username: String,

    var password: String? = null,

    var oidcProviderId: String? = null,

    @Nullable
    @Column(unique = true)
    @Convert(converter = EncryptionConverter::class)
    var email: String,

    var emailConfirmed: Boolean = false,

    var enabled: Boolean = false,

    @Embedded
    @Nullable
    var avatar: Avatar? = null,

    @ElementCollection(targetClass = Role::class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    var roles: Set<Role> = emptySet()
) {

    constructor(oidcUser: OidcUser) : this(
        username = oidcUser.preferredUsername,
        email = oidcUser.email,
        emailConfirmed = true,
        enabled = true,
        oidcProviderId = oidcUser.subject
    )
}