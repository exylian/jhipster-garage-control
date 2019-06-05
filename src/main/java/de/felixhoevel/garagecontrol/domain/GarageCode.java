package de.felixhoevel.garagecontrol.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A GarageCode.
 */
@Entity
@Table(name = "garage_code")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GarageCode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @ManyToOne
    @JsonIgnoreProperties("garageCodes")
    private Garage garageId;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public GarageCode createdAt(LocalDate createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public GarageCode validUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
        return this;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public Garage getGarageId() {
        return garageId;
    }

    public GarageCode garageId(Garage garage) {
        this.garageId = garage;
        return this;
    }

    public void setGarageId(Garage garage) {
        this.garageId = garage;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GarageCode)) {
            return false;
        }
        return id != null && id.equals(((GarageCode) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "GarageCode{" +
            "id=" + getId() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", validUntil='" + getValidUntil() + "'" +
            "}";
    }
}
