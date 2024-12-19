package de.grimsi.gameyfin.users.preferences

import de.grimsi.gameyfin.core.security.EncryptionConverter
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.io.Serializable

@Entity
class UserPreference(
    @NotNull
    @EmbeddedId
    val id: UserPreferenceKey,

    @NotNull
    @Column(name = "`value`")
    @Convert(converter = EncryptionConverter::class)
    var value: String
)

@Embeddable
data class UserPreferenceKey(
    @Column(name = "`key`")
    val key: String,

    @Column(name = "user_id")
    val userId: Long
) : Serializable